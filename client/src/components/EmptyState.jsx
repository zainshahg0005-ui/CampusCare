import React from 'react';
import { FolderSearch } from 'lucide-react';

/**
 * Minimalist Empty State Component
 */
const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No records found',
  description = 'Try adjusting your filters or search query.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  children,
}) => {
  return (
    <div style={{ padding: '3.75rem 1.5rem', textAlign: 'center', maxWidth: 440, margin: '0 auto' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#f4f4f5',
          border: '1px solid #e4e4e7',
          color: '#18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.15rem',
        }}
      >
        <Icon size={24} />
      </div>
      <h4 style={{ fontSize: '1.1rem', color: '#09090b', marginBottom: '0.4rem', fontWeight: 700 }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: '#71717a', lineHeight: 1.5, marginBottom: actionLabel || children ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionLabel && (
        <button type="button" onClick={onAction} className="btn btn-outline btn-sm">
          {ActionIcon && <ActionIcon size={15} />}
          <span>{actionLabel}</span>
        </button>
      )}
      {children}
    </div>
  );
};

export default EmptyState;
