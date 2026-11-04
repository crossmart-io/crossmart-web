import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Pagination } from '@/hooks/usePagination';
import { TablePagination } from './TablePagination';

function renderPagination(page: number, total: number) {
  const pagination: Pagination = {
    page,
    pageSize: 25,
    setPage: vi.fn<(page: number) => void>(),
    setPageSize: vi.fn<Pagination['setPageSize']>(),
  };
  render(
    <TablePagination
      pagination={pagination}
      total={total}
      pageCount={Math.ceil(total / 25)}
      noun="product"
    />,
  );
  return pagination;
}

describe('TablePagination', () => {
  it('says which rows are shown and moves between pages', async () => {
    const pagination = renderPagination(2, 312);

    expect(screen.getByText('26–50 of 312 products')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Page 13' }));

    expect(pagination.setPage).toHaveBeenNthCalledWith(1, 3);
    expect(pagination.setPage).toHaveBeenNthCalledWith(2, 13);
  });

  it('cannot go before the first page or past the last', () => {
    renderPagination(1, 10);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByText('1–10 of 10 products')).toBeInTheDocument();
  });
});
