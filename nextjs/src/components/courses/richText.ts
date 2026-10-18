/**
 * CMS rich text (Framer markup with classes stripped) -> the preset classes the course page's Framer rich-text
 * blocks carry: h4 = preset 1goqrxy, p / li = preset 1ijstdn. Bullets and list indents live in the page CSS.
 */
export function richText(html: string): string {
  return html
    .replace(/<h4>/g, '<h4 class="p-1goqrxy">')
    .replace(/<p>/g, '<p class="p-1ijstdn">')
    .replace(/<li>/g, '<li class="p-1ijstdn">');
}
