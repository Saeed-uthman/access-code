import { useState } from 'react';
import { Pencil, Trash2, Plus, Power } from 'lucide-react';
import { Button, DataTable, Card, CardContent, Badge, Modal, Column } from '@/shared/components';
import { formatCurrency, formatDate } from '@/utils/format';
import { useAdminPlans, useDeletePlan, useTogglePlanStatus } from '../hooks/use-plans';
import { PlanForm } from '../components/plan-form';
import { useCreatePlan, useUpdatePlan } from '../hooks/use-plans';
import type { Plan, PlanCreateRequest, PlanUpdateRequest } from '../types';
import { usePlanStats } from '../hooks/use-plans';

export default function AdminPlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const { data, isLoading } = useAdminPlans();
  const { data: stats } = usePlanStats();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();
  const toggleStatusMutation = useTogglePlanStatus();

  const plans = data?.results || [];

  const handleCreate = (planData: PlanCreateRequest | PlanUpdateRequest) => {
    createPlanMutation.mutate(planData as PlanCreateRequest, {
      onSuccess: () => setShowCreateModal(false),
    });
  };

  const handleUpdate = (planData: PlanCreateRequest | PlanUpdateRequest) => {
    if (!editingPlan) return;
    updatePlanMutation.mutate(
      { id: editingPlan.id, data: planData as PlanUpdateRequest },
      { onSuccess: () => setEditingPlan(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingPlanId) return;
    deletePlanMutation.mutate(deletingPlanId, {
      onSuccess: () => setDeletingPlanId(null),
    });
  };

  const columns: Column<Plan>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'plan_type',
      header: 'Type',
      render: (plan) => (
        <Badge variant={plan.plan_type === 'house' ? 'default' : plan.plan_type === 'business' ? 'secondary' : 'outline'}>
          {plan.plan_type}
        </Badge>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (plan) => formatCurrency(plan.cost),
    },
    {
      key: 'validity',
      header: 'Validity',
      render: (plan) => `${plan.validity} (${plan.validity_days}d)`,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (plan) => (
        <Badge variant={plan.is_active ? 'success' : 'destructive'}>
          {plan.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (plan) => formatDate(plan.created_at),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (plan) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStatusMutation.mutate(plan.id)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            title="Toggle Status"
          >
            <Power className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingPlan(plan)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingPlanId(plan.id)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Plans</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Plans</p>
              <p className="text-2xl font-bold">{stats.total_plans}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active_plans}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_revenue)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTable columns={columns} data={plans} isLoading={isLoading} />

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Plan">
        <PlanForm onSubmit={handleCreate} isLoading={createPlanMutation.isPending} />
      </Modal>

      <Modal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} title="Edit Plan">
        {editingPlan && (
          <PlanForm plan={editingPlan} onSubmit={handleUpdate} isLoading={updatePlanMutation.isPending} />
        )}
      </Modal>

      <Modal isOpen={!!deletingPlanId} onClose={() => setDeletingPlanId(null)} title="Delete Plan">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this plan? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingPlanId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deletePlanMutation.isPending}>
              {deletePlanMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
