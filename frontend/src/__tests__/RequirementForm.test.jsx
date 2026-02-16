import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import RequirementForm from '../components/RequirementForm.jsx';

describe('RequirementForm', () => {
  it('prevents submit when required fields are missing', () => {
    const onSubmit = vi.fn();
    render(<RequirementForm onSubmit={onSubmit} loading={false} />);

    fireEvent.click(screen.getByText('Build Shortlist'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid payload', () => {
    const onSubmit = vi.fn();
    render(<RequirementForm onSubmit={onSubmit} loading={false} />);

    fireEvent.change(screen.getByLabelText(/What do you need\?/i), { target: { value: 'Need CRM software' } });
    fireEvent.change(screen.getByLabelText(/Budget range/i), { target: { value: '$1500' } });
    fireEvent.change(screen.getByLabelText(/Region/i), { target: { value: 'US' } });
    fireEvent.change(screen.getByLabelText(/Must-have features/i), { target: { value: 'SSO,Audit logs,API' } });

    fireEvent.click(screen.getByText('Build Shortlist'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
