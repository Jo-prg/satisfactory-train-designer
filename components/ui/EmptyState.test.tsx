import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render default message', () => {
    render(<EmptyState />);
    expect(screen.getByText(/No items yet/i)).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<EmptyState message="Custom empty message" />);
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('should render instruction text', () => {
    render(<EmptyState />);
    expect(screen.getByText(/Click "Add an item \+"/i)).toBeInTheDocument();
  });

  it('should have correct styling class', () => {
    const { container } = render(<EmptyState />);
    const emptyState = container.querySelector('.emptyState');
    expect(emptyState).toBeInTheDocument();
  });
});
