import React from 'react';
import { Link } from 'react-router-dom';
import type { ICrumb } from '../types';
import './styles/Breadcrumbs.css';

interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const allCrumbs = [{ label: 'Главная', path: '/' }, ...crumbs];

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {allCrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {crumb.active || index === allCrumbs.length - 1 ? (
            <span className="breadcrumbs__item">{crumb.label}</span>
          ) : (
            <Link to={crumb.path || '#'} className="breadcrumbs__link">
              {crumb.label}
            </Link>
          )}
          {index < allCrumbs.length - 1 && (
            <span className="breadcrumbs__sep">›</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
