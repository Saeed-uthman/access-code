from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, OTPVerification


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'phone_number', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError({'message': 'Invalid credentials'})
            if not user.check_password(password):
                raise serializers.ValidationError({'message': 'Invalid credentials'})
            if user.is_blocked:
                raise serializers.ValidationError({'message': 'Your account has been blocked'})
            if not user.is_verified:
                raise serializers.ValidationError({'message': 'Please verify your email and phone number'})
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError({'message': 'Email and password are required'})


class OTPVerificationSerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6)
    otp_type = serializers.ChoiceField(choices=OTPVerification.OTP_TYPES)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['address', 'date_of_birth']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'full_name', 'phone_number',
            'role', 'is_email_verified', 'is_blocked', 'created_at', 'profile', 'is_admin',
        ]
        read_only_fields = ['id', 'role', 'created_at']

    def get_is_admin(self, obj):
        return obj.role == 'admin'


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    confirm_new_password = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'phone_number', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user)
        return user
