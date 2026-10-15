import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { ErrorState } from '@/components/ui/States'
import { LoadingState } from '@/components/ui/Spinner'
import { InvestmentForm } from '@/features/investments/components/InvestmentForm'
import { InvestmentStatusBadge } from '@/features/investments/components/InvestmentStatusBadge'
import {
  useDeleteInvestment,
  useInvestment,
  useUpdateInvestment,
} from '@/features/investments/hooks/useInvestments'
import { formatArea, formatCurrencyPrecise, formatDate, toErrorMessage } from '@/lib/utils'
import type { InvestmentInput } from '@/types/models'

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="text-sm text-slate-900">{children}</dd>
    </div>
  )
}

export function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: investment, isLoading, isError, error, refetch } = useInvestment(id)
  const updateInvestment = useUpdateInvestment()
  const deleteInvestment = useDeleteInvestment()

  const [isFormOpen, setFormOpen] = useState(false)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  if (isLoading) return <LoadingState label="Loading investment…" />

  if (isError || !investment) {
    return (
      <ErrorState
        title="Investment not found"
        description={error ? toErrorMessage(error) : 'This investment may have been deleted.'}
        onRetry={() => void refetch()}
      />
    )
  }

  const handleSubmit = async (input: InvestmentInput) => {
    setActionError(null)
    await updateInvestment.mutateAsync({ id: investment.id, input })
    setFormOpen(false)
  }

  const handleDelete = async () => {
    setActionError(null)
    try {
      await deleteInvestment.mutateAsync(investment.id)
      void navigate('/investments', { replace: true })
    } catch (deleteError) {
      setActionError(toErrorMessage(deleteError))
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <Link
        to="/investments"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.83 10l3.94 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
            clipRule="evenodd"
          />
        </svg>
        All investments
      </Link>

      <PageHeader
        title={investment.title}
        description={
          [investment.address, investment.city, investment.country].filter(Boolean).join(', ') ||
          'No location recorded'
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </>
        }
      />

      {actionError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset">
          {actionError}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Deal details" actions={<InvestmentStatusBadge status={investment.status} />} />
          <CardBody>
            <dl className="grid gap-x-8 sm:grid-cols-2">
              <DetailRow label="Typology">{investment.typology}</DetailRow>
              <DetailRow label="Area">{formatArea(investment.area_sqm)}</DetailRow>
              <DetailRow label="Asking price">
                {formatCurrencyPrecise(investment.asking_price)}
              </DetailRow>
              <DetailRow label="Purchase price">
                {formatCurrencyPrecise(investment.purchase_price)}
              </DetailRow>
              <DetailRow label="Expected earnings">
                <span className="font-medium text-emerald-700">
                  {formatCurrencyPrecise(investment.expected_earnings)}
                </span>
              </DetailRow>
              <DetailRow label="Listing">
                {investment.source_url ? (
                  <a
                    href={investment.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Open listing
                  </a>
                ) : (
                  '—'
                )}
              </DetailRow>
              <DetailRow label="Added">{formatDate(investment.created_at)}</DetailRow>
              <DetailRow label="Last updated">{formatDate(investment.updated_at)}</DetailRow>
            </dl>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader
              title="Lawyer"
              actions={
                <Link to="/lawyers" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Manage
                </Link>
              }
            />
            <CardBody>
              {investment.lawyer ? (
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900">{investment.lawyer.name}</p>
                  <p className="text-xs text-slate-500">Linked to this investment</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No lawyer assigned. Edit the investment to link one.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notes" />
            <CardBody>
              {investment.notes ? (
                <p className="text-sm whitespace-pre-wrap text-slate-700">{investment.notes}</p>
              ) : (
                <p className="text-sm text-slate-500">No notes yet.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        size="lg"
        title="Edit investment"
        description={investment.title}
      >
        <InvestmentForm
          investment={investment}
          submitting={updateInvestment.isPending}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete investment"
        message={
          <>
            Are you sure you want to delete <strong>{investment.title}</strong>? This cannot be
            undone.
          </>
        }
        loading={deleteInvestment.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
