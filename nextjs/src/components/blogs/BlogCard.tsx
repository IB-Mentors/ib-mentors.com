import Link from "next/link";
import s from "./BlogCard.module.css";

/**
 * Framer component "Blog Card V2" (module yMu5HGDW*.mjs, framer-zWWnd). Two variants, picked per breakpoint in CSS:
 *   "Desktop Blog Card " (>= 1380px): gap 30, image at scale 1.2 that eases to 1 on hover (tween 0.5 s [0.44,0,0.56,1])
 *   "Tablet Blog Card V2" (< 1380px):  gap 25, content gap 8, image at scale 1, no hover
 */
export type BlogCardProps = {
  href: string;
  image: { src: string; alt: string } | null;
  category: string;
  title: string;
  date: string;
  author: string;
  className?: string;
};

export function BlogCard({ href, image, category, title, date, author, className }: BlogCardProps) {
  return (
    <Link href={href} className={`${s.card}${className ? ` ${className}` : ""}`} data-framer-name="Desktop Blog Card ">
      <div className={s.imageWrapper} data-framer-name="Image Wrapper">
        <div className={s.image}>
          {image && <img className={s.img} src={image.src} alt={image.alt} decoding="async" loading="lazy" />}
        </div>
      </div>
      <div className={s.content} data-framer-name="Content Wrapper">
        <div className={s.subTitle} data-framer-name="Sub Title">
          <div className={s.text} data-framer-name="Category">
            <p className={`p-w4t77b ${s.category}`}>{category}</p>
          </div>
          <div className={s.text} data-framer-name="Title">
            <h4 className={`p-1goqrxy ${s.title}`}>{title}</h4>
          </div>
        </div>
        <div className={s.dateWrapper} data-framer-name="Date Wrapper">
          <div className={s.nowrap} data-framer-name="Date">
            <p className="p-1ijstdn">{date}</p>
          </div>
          <div className={s.line} data-framer-name="Line" />
          <div className={s.nowrap} data-framer-name="Text">
            <p className="p-1ijstdn">{author}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
