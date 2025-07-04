import Blogs from "./blog/page";

export default function Home() {
  return (
    <div>
      <div className="md:text-center mt-28">
        <h1 className="font-extrabold text-3xl md:text-5xl xl:text-7xl leading-[2.5rem] md:leading-[5rem] xl:leading-[7rem]">
          Hi It's{" "}
          <span className="text-purple-600 shadow-lg shadow-purple-400">
            Bala@Dev.
          </span>{" "}
          Discover My{" "}
          <span className="text-purple-600 shadow-lg shadow-purple-400">
            Stories
          </span>{" "}
          and{" "}
          <span className="text-purple-600 shadow-lg shadow-purple-400">
            Blogs
          </span>{" "}
          here.
        </h1>
      </div>
      <div>
        <Blogs />
      </div>
    </div>
  );
}
