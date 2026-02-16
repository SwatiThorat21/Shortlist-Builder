import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import RequirementForm from '../components/RequirementForm.jsx';

describe('RequirementForm', () => {
  it('shows validation errors for missing fields', () => {
    const onSubmit = vi.fn();
    render(<RequirementForm onSubmit={onSubmit} loading={false} />);

    fireEvent.click(screen.getByText('Build Shortlist'));
    expect(screen.getByText('Need cannot be empty')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid payload', () => {
    const onSubmit = vi.fn();
    render(<RequirementForm onSubmit={onSubmit} loading={false} />);

    fireEvent.change(screen.getByLabelText('Need'), { target: { value: 'Need CRM software' } });
    fireEvent.change(screen.getByLabelText('Budget range (required)'), { target: { value: '$1500' } });
    fireEvent.change(screen.getByLabelText('Region'), { target: { value: 'US' } });
    fireEvent.change(screen.getByLabelText('Must-have features (comma separated)'), { target: { value: 'SSO,Audit logs,API' } });

    fireEvent.click(screen.getByText('Build Shortlist'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
