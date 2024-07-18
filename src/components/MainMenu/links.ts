export type MenuLink = {
  label: string;
  href: string;
  onHover?: (...args: any) => void;
  onDisHover?: (...args: any) => void;
}