import { type Post, allPosts } from "@/.contentlayer/generated";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blogs-grid";
import { CTA } from "@/components/cta";
import { TopLeftShiningLight, TopRightShiningLight } from "@/components/svg/background-shiny";
import { MeteorLinesAngular } from "@/components/ui/meteorLines";
import { authors } from "@/content/blog/authors";
import Link from "next/link";

export const metadata = {
  title: "Blog | Unkey",
  description: "Latest blog posts and news from the Unkey team.",
  openGraph: {
    title: "Blog | Unkey",
    description: "Latest blog posts and news from the Unkey team.",
    url: "https://unkey.dev/blog",
    siteName: "unkey.dev",
    images: [
      {
        url: "https://unkey.dev/images/landing/og.png",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    title: "Blog | Unkey",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/images/landing/unkey.png",
  },
};

type Props = {
  searchParams?: {
    tag?: string;
    page?: number;
  };
};

export default async function Blog(props: Props) {
  const posts = allPosts.sort((a: Post, b: Post) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  return (
    <>
      <div className="container mx-auto mt-32 scroll-smooth w-full overflow-hidden">
        {/* <div>
          <TopLeftShiningLight />
        </div> */}
        <div className="w-full h-full overflow-hidden -z-20">
          <MeteorLinesAngular
            number={1}
            xPos={0}
            speed={10}
            delay={5}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={0}
            speed={10}
            delay={0}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={100}
            speed={10}
            delay={7}
            className="overflow-hidden md:hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={100}
            speed={10}
            delay={2}
            className="overflow-hidden md:hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={200}
            speed={10}
            delay={7}
            className="overflow-hidden hidden md:block"
          />
          <MeteorLinesAngular
            number={1}
            xPos={200}
            speed={10}
            delay={2}
            className="overflow-hidden hidden md:block"
          />
          <MeteorLinesAngular
            number={1}
            xPos={400}
            speed={10}
            delay={5}
            className="hidden overflow-hidden lg:block"
          />
          <MeteorLinesAngular
            number={1}
            xPos={400}
            speed={10}
            delay={0}
            className="hidden overflow-hidden lg:block"
          />
        </div>
        <div>
          <TopRightShiningLight />
        </div>
        <div className="w-full px-0 mx-0 rounded-3xl">
          <Link href={`${posts[0]._raw.flattenedPath}`} key={posts[0]._raw.flattenedPath}>
            <BlogHero
              tags={posts[0].tags}
              imageUrl={posts[0].image ?? "/images/blog-images/defaultBlog.png"}
              title={posts[0].title}
              subTitle={posts[0].description}
              author={authors[posts[0].author]}
              publishDate={posts[0].date}
            />
          </Link>
        </div>
        <BlogGrid posts={posts} searchParams={props.searchParams} />
        <CTA />
      </div>
    </>
  );
}
