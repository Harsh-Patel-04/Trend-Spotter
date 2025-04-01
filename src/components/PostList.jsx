// import React from "react";

// const PostList = ({ posts }) => {
//   if (!posts?.length)
//     return (
//       <div className="text-gray-400 text-center py-4">No posts analyzed</div>
//     );

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold mb-4 text-white">Analyzed Posts</h3>
//       {posts.map((post, index) => (
//         <div
//           key={index}
//           className="bg-gray-700/10 p-4 rounded-lg border border-gray-700/30"
//         >
//           <h4
//             className="font-medium mb-2 text-white"
//             dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.title) }}
//           />
//           {/* Comments list with sanitization... */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PostList;

import React from "react";
import DOMPurify from "dompurify";

const sanitizeHTML = (text) => DOMPurify.sanitize(text);

const PostList = ({ posts }) => {
  if (!posts?.length) {
    return (
      <div className="text-gray-400 text-center py-4">No posts analyzed</div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Analyzed Posts</h3>
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-gray-700/10 p-4 rounded-lg border border-gray-700/30"
        >
          <h4
            className="font-medium mb-2 text-white"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.title) }}
          />
          <div className="mt-4 space-y-2">
            {post.comments?.map((comment, idx) => (
              <div key={idx} className="p-3 bg-gray-800/20 rounded-md">
                <p
                  className="text-gray-300 mb-1"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(comment.text),
                  }}
                />
                <span
                  className={`text-sm font-medium ${
                    comment.sentiment === "positive"
                      ? "text-green-400"
                      : comment.sentiment === "negative"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {comment.sentiment} ({comment.score?.toFixed(2)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
