import logging
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from accounts.models import User, OTPVerification, UserProfile
from accounts.serializers import (
    UserRegistrationSerializer, UserLoginSerializer, OTPVerificationSerializer,
    UserSerializer, UserProfileSerializer, PasswordChangeSerializer,
    AdminUserCreateSerializer,
)
from accounts.services import AuthService
from accounts.permissions import IsAdminUser
from accounts.throttles import LoginThrottle, OTPThrottle, PasswordChangeThrottle
from core.filters import UserFilter

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = AuthService.register_user(
            email=data['email'], username=data['username'],
            full_name=data['full_name'], phone_number=data['phone_number'],
            password=data['password'],
        )
        return Response({
            'message': 'Registration successful. Please verify your email.',
            'user_id': user.id,
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([LoginThrottle])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    tokens = AuthService.generate_tokens(user)
    return Response({
        'refresh': tokens['refresh'],
        'access': tokens['access'],
        'user': UserSerializer(user).data,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([OTPThrottle])
def verify_otp_view(request):
    serializer = OTPVerificationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_id = request.data.get('user_id')
    otp_code = serializer.validated_data['otp_code']
    otp_type = serializer.validated_data['otp_type']
    user = get_object_or_404(User, id=user_id)
    success, result = AuthService.verify_otp(user, otp_code, otp_type)
    if not success:
        return Response({'error': result}, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'message': f'{otp_type.title()} verified successfully',
        'data': {
            'user': {'id': str(user.id), 'email': user.email, 'username': user.username},
            'token': result['access'],
            'refresh': result['refresh'],
        },
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([OTPThrottle])
def resend_otp_view(request):
    user_id = request.data.get('user_id')
    otp_type = request.data.get('otp_type')
    user = get_object_or_404(User, id=user_id)
    success, message = AuthService.resend_otp(user, otp_type)
    if not success:
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': message})


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@throttle_classes([PasswordChangeThrottle])
def change_password_view(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    AuthService.change_password(request.user, serializer.validated_data['new_password'])
    return Response({'message': 'Password changed successfully'})


class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filterset_class = UserFilter

    def get_queryset(self):
        return User.objects.select_related('profile').order_by('-created_at')


class AdminUserCreateView(generics.CreateAPIView):
    serializer_class = AdminUserCreateSerializer
    permission_classes = [IsAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.select_related('profile')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_block_user_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    action = request.data.get('action')
    if action == 'block':
        AuthService.block_user(user)
        message = f'User {user.full_name} has been blocked'
    elif action == 'unblock':
        AuthService.unblock_user(user)
        message = f'User {user.full_name} has been unblocked'
    else:
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': message})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    refresh_token = request.data.get('refresh_token')
    if not refresh_token:
        return Response({'error': 'refresh_token is required'}, status=status.HTTP_400_BAD_REQUEST)
    if AuthService.logout(refresh_token):
        return Response({'message': 'Logout successful'})
    return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
