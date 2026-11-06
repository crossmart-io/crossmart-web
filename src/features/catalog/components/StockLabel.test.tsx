import { render, screen } from '@testing-library/react';
import { StockLabel } from './StockLabel';

describe('StockLabel', () => {
  it('counts the stock on hand', () => {
    render(<StockLabel totalAvailable={23} variantCount={1} />);
    expect(screen.getByText(/23 in stock/)).toBeInTheDocument();
  });

  it('says a product is oversold instead of showing negative stock', () => {
    render(<StockLabel totalAvailable={-12} variantCount={2} />);
    expect(screen.getByText(/Oversold by 12/)).toBeInTheDocument();
    expect(screen.queryByText(/-12|−12/)).not.toBeInTheDocument();
  });

  it('says when stock is not tracked', () => {
    render(<StockLabel totalAvailable={null} variantCount={3} />);
    expect(screen.getByText(/Not tracked/)).toBeInTheDocument();
  });
});
