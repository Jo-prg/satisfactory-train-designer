import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('should render value', () => {
    render(<Badge value={5} label="Cars" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render label', () => {
    render(<Badge value={10} label="Freight Cars" />);
    expect(screen.getByText('Freight Cars')).toBeInTheDocument();
  });

  it('should render zero value', () => {
    render(<Badge value={0} label="Items" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render large numbers', () => {
    render(<Badge value={9999} label="Count" />);
    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = render(<Badge value={3} label="Test" />);
    const badgeContainer = container.querySelector('.badgeContainer');
    expect(badgeContainer).toBeInTheDocument();
  });
});
