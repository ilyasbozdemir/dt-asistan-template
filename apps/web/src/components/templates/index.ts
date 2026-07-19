export { IhtiyacListesi } from './1-ihtiyac-tespiti-ve-baslangic/IhtiyacListesi';
import { defaultIhtiyacListesiData } from '../../lib/schemas/IhtiyacListesi.schema';

export const TEMPLATE_REGISTRY = [
  { 
    id: 'ihtiyac-listesi', 
    name: 'IhtiyacListesi', 
    category: '1-ihtiyac-tespiti-ve-baslangic',
    defaultData: defaultIhtiyacListesiData 
  }
];
