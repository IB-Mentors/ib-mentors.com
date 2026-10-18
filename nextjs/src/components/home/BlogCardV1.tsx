import Link from "next/link";
import type { BlogPost } from "@/content/blogs";
import s from "./Home.module.css";
import { FImg } from "./parts";

/**
 * Framer component "Blog Card V1" (Home module, framer-zkJjC). Variants used on /: "Desktop Blog Card V1" (big card),
 * "Desktop Blog Card V2" (row card with a bottom rule), "Tablet Blog Card V1", "Phone Blog Card V1".
 * Hover (desktop variants only): the image scales 1.2 -> 1 and V2's bottom rule turns navy (tween 0.4s).
 */
export type BlogCardV1Variant = "Desktop Blog Card V1" | "Desktop Blog Card V2" | "Tablet Blog Card V1" | "Phone Blog Card V1";

const V: Record<BlogCardV1Variant, { cls: string; border: boolean }> = {
  "Desktop Blog Card V1": { cls: s.v_1tpq5xb, border: false },
  "Desktop Blog Card V2": { cls: s.v_aovz5y, border: true },
  "Tablet Blog Card V1": { cls: s.v_15lmu1g, border: true },
  "Phone Blog Card V1": { cls: s.v_1kf9tw4, border: true },
};

export function BlogCardV1({ post, variant }: { post: BlogPost; variant: BlogCardV1Variant }) {
  const v = V[variant];
  const img = post.cardImage ?? post.image;
  return (
    <Link
      className={`${s.c_1tpq5xb} ${v.cls} ${s.c_17lu3ch} ${s.blogCard}`}
      data-framer-name={variant}
      href={`/blogs/${post.slug}`}
      data-border={v.border ? "true" : undefined}
      style={{
        "--border-bottom-width": v.border ? "1px" : "0px",
        "--border-color": v.border ? "var(--token-1286fb0c-fdd3-4b46-bcee-b5d98b6bb7ac, rgb(210, 206, 197))" : "rgba(0, 0, 0, 0)",
        "--border-left-width": "0px",
        "--border-right-width": "0px",
        "--border-style": "solid",
        "--border-top-width": "0px",
        width: "100%",
      }}
    >
      <div className={s.c_3ldd6} data-framer-name="Image Wrapper" style={{ borderRadius: "10px" }}>
        <div className={`${s.c_5ac23r} ${s.blogImg}`} style={{ borderRadius: "10px" }}>
          {img ? <FImg src={img.src} alt={img.alt || "Image"} /> : null}
        </div>
      </div>
      <div className={s.c_1qcv5nr} data-framer-name="Category & Title Wrapper">
        <div className={s.c_1jdmym}>
          <div className={`${s.c_wqzokq} ${s.rt}`} data-framer-name="Category">
            <p className="p-w4t77b" style={{ textAlign: "left", color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))" }}>
              {post.category}
            </p>
          </div>
          <div className={`${s.c_2jfype} ${s.rt}`} data-framer-name="Title">
            <h4 className="p-1goqrxy" style={{ textAlign: "left", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))" }}>
              {post.title}
            </h4>
          </div>
        </div>
        <div className={s.c_ivcdjj} data-framer-name="Date & Name ">
          <div className={`${s.c_d11a2c} ${s.rt}`} data-framer-name="Date">
            <p className="p-vft582" style={{ textAlign: "left", color: "var(--token-c7693201-4213-426e-a6de-0fbb44d0f402, rgb(85, 85, 85))" }}>
              {post.date}
            </p>
          </div>
          <div className={s.c_18vabd9} data-framer-name="Line" style={{ backgroundColor: "var(--token-1286fb0c-fdd3-4b46-bcee-b5d98b6bb7ac, rgb(210, 206, 197))" }} />
          <div className={`${s.c_1dx6g3w} ${s.rt}`} data-framer-name="Name">
            <p className="p-vft582" style={{ textAlign: "left", color: "var(--token-c7693201-4213-426e-a6de-0fbb44d0f402, rgb(85, 85, 85))" }}>
              {post.author}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
