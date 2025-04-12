import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('h-9 px-3');
  });
});
