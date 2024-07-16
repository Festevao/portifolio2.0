export type MenuLink = {
  label: string;
  href: string;
  icon?: string;
}

export const menuLinks: MenuLink[] = [
  {
    label: 'Base de conhecimento',
    href: 'knowledge',
  },
  {
    label: 'Blog pessoal',
    href: '/blog',
  },
  {
    label: 'Sobre mim',
    href: '/about',
  },
  {
    label: 'Exxperiencia',
    href: '',
  },
  {
    label: 'Formação',
    href: '',
  },
  {
    label: 'Label de enchimento',
    href: '',
  },
];
