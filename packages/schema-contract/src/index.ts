export type FieldKind =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'switch'
  | 'textarea';

export interface OptionDefinition {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldKind;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: readonly OptionDefinition[];
}

export type ColumnKind = 'text' | 'number' | 'date' | 'datetime' | 'status' | 'boolean';

export interface ColumnDefinition {
  key: string;
  title: string;
  type?: ColumnKind;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'search' | 'select' | 'date-range' | 'boolean';
  options?: readonly OptionDefinition[];
}

export interface ActionDefinition {
  key: string;
  label: string;
  intent?: 'default' | 'primary' | 'destructive';
  permission?: string;
}

export interface PageMetadata {
  title: string;
  description?: string;
  breadcrumbs?: readonly {label: string; href?: string}[];
}
