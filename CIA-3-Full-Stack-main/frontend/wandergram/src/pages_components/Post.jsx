import { useNavigate } from "react-router";

export function Post({ data }) {
  let navigate = useNavigate();

  return (
    <button
      className="w-175  m-3 hover:cursor-pointer"
      onClick={() => navigate(`/post/${data._id}`)}
    >
      <div className="flex border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Image: 60% */}
        <figure className="w-3/5">
          <img
            src={data.picture}
            alt="Post"
            className="h-full w-full object-cover"
          />
        </figure>

        {/* Text: 40% */}
        <div className="w-2/5 p-4 flex flex-col justify-between ">
          <h2 className="text-lg font-bold mb-2">{data.title}</h2>
          <hr className="border-gray-300 mb-2" />
          <p className="text-white-700 text-sm">{data.description}</p>
        </div>
      </div>
    </button>
  );
}
