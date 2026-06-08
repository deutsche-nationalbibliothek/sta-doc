import slugify from 'slugify';  

export const slugifyLabel = (label?: string) => {
  return slugify(label || 'label-is-missing').replace(/[^a-zA-Z0-9\- ]/g, '');
};