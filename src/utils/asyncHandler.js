//todo: using callback.
const asyncHandler = (reqHandlerFunction) => {
  return (req, res, next) => {
    Promise.resolve(reqHandlerFunction(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

//todo: using async await.
// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.json({
//         message: error.message,
//       });
//     }
//   };
// };

export { asyncHandler };
