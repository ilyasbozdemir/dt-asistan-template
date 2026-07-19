export * from './base.schema';
export * from './theme.config';

// Document base elements
export * from './document/DocumentLayout';
export * from './document/DocumentHeader';
export * from './document/DocumentFooter';
export * from './document/DocumentTable';
export * from './document/ApprovalSignature';
export * from './document/DynamicPaginatedTable';

// Specific templates
export * from './templates/IhtiyacListesi.schema';
export * from './templates/IhtiyacListesi';

import { defaultIhtiyacListesiData } from './templates/IhtiyacListesi.schema';

export const TEMPLATE_REGISTRY = [
  { 
    id: 'ihtiyac-listesi', 
    name: 'IhtiyacListesi', 
    category: '1-ihtiyac-tespiti-ve-baslangic',
    defaultData: defaultIhtiyacListesiData 
  }
];
