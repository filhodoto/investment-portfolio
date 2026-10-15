import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { LoadingState } from '@/components/ui/Spinner'
import { LawyerForm } from '@/features/lawyers/components/LawyerForm'
import {
  useCreateLawyer,
  useDeleteLawyer,
  useLawyers,
  useUpdateLawyer,
} from '@/features/lawyers/hooks/useLawyers'
import { useInvestments } from '@/features/investments/hooks/useInvestments'
import { toErrorMessage } from '@/lib/utils'
import { EMPTY_FILTERS, type Lawyer, type LawyerInput } from '@/types/models'

export function LawyersPage() {
  const { data: lawyers, isLoading, isError, error, refetch } = useLawyers()
  const { data: investments = [] } = useInvestments(EMPTY_FILTERS)

  const createLawyer = useCreateLawyer()
  const updateLawyer = useUpdateLawyer()
  const deleteLawyer = useDeleteLawyer()

  const [editing, setEditing] = useState<Lawyer | null>(null)
  const [isFormOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Lawyer | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  /** lawyer id -> number of investments linked to them */
  const investmentCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const investment of investments) {
      if (!investment.lawyer_id) continue
      counts.set(investment.lawyer_id, (counts.get(investment.lawyer_id) ?? 0) + 1)
    }
    return counts
  }, [investments])

  const visibleLawyers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return lawyers ?? []
    return (lawyers ?? []).filter((lawyer) =>
      [lawyer.name, lawyer.email, lawyer.office, lawyer.phone]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    )
  }, [lawyers, search])

  const openCreate = () => {
    setActionError(null)
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (lawyer: Lawyer) => {
    setActionError(null)
    setEditing(lawyer)
    setFormOpen(true)
  }

  const handleSubmit = async (input: LawyerInput) => {
    setActionError(null)
    if (editing) {
      await updateLawyer.mutateAsync({ id: editing.id, input })
    } else {
      await createLawyer.mutateAsync(input)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setActionError(null)
    try {
      await deleteLawyer.mutateAsync(pendingDelete.id)
    } catch (deleteError) {
      setActionError(toErrorMessage(deleteError))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Lawyers"
        description="The lawyers you work with. Link them to investments to keep track of who is on what."
        actions={<Button onClick={openCreate}>New lawyer</Button>}
      />

      {actionError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 ring-inset">
          {actionError}
        </p>
      )}

      <Card>
        <CardHeader
          title="Directory"
          description={
            lawyers ? `${lawyers.length} ${lawyers.length === 1 ? 'lawyer' : 'lawyers'}` : undefined
          }
          actions={
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lawyers…"
              aria-label="Search lawyers"
              className="w-48 rounded-lg bg-white px-3 py-2 text-sm text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          }
        />

        {isLoading ? (
          <LoadingState label="Loading lawyers…" />
        ) : isError ? (
          <ErrorState description={toErrorMessage(error)} onRetry={() => void refetch()} />
        ) : visibleLawyers.length === 0 ? (
          <EmptyState
            title={lawyers && lawyers.length > 0 ? 'No lawyers match your search' : 'No lawyers yet'}
            description={
              lawyers && lawyers.length > 0
                ? 'Try a different name, office or email.'
                : 'Add the lawyers you work with so you can attach them to deals.'
            }
            actionLabel={lawyers && lawyers.length > 0 ? undefined : 'Add a lawyer'}
            onAction={lawyers && lawyers.length > 0 ? undefined : openCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th scope="col" className="px-5 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Contact</th>
                  <th scope="col" className="px-4 py-3">Office</th>
                  <th scope="col" className="px-4 py-3 text-right">Deals</th>
                  <th scope="col" className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleLawyers.map((lawyer) => {
                  const count = investmentCounts.get(lawyer.id) ?? 0
                  return (
                    <tr key={lawyer.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{lawyer.name}</p>
                        {lawyer.notes && (
                          <p className="mt-0.5 line-clamp-1 max-w-72 text-xs text-slate-500">
                            {lawyer.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          {lawyer.email ? (
                            <a
                              href={`mailto:${lawyer.email}`}
                              className="text-slate-700 hover:text-indigo-600"
                            >
                              {lawyer.email}
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                          {lawyer.phone && <span className="text-xs text-slate-500">{lawyer.phone}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {lawyer.office ?? <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {count > 0 ? (
                          <Link
                            to="/investments"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            {count}
                          </Link>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(lawyer)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => setPendingDelete(lawyer)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <CardBody className="border-t border-slate-200 text-xs text-slate-500">
              Deleting a lawyer keeps their investments — the link is simply cleared.
            </CardBody>
          </div>
        )}
      </Card>

      <Modal
        open={isFormOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        title={editing ? 'Edit lawyer' : 'New lawyer'}
        description={editing ? editing.name : 'Add a lawyer to your directory.'}
      >
        <LawyerForm
          lawyer={editing}
          submitting={createLawyer.isPending || updateLawyer.isPending}
          submitLabel={editing ? 'Save changes' : 'Create lawyer'}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete lawyer"
        message={
          <>
            Delete <strong>{pendingDelete?.name}</strong>? Investments linked to them will keep their
            details but lose the lawyer association.
          </>
        }
        loading={deleteLawyer.isPending}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
