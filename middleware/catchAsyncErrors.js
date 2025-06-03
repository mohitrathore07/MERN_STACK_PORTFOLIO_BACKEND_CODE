export const catchAsyncErrors = (theFuction) =>{
    return (req, res , next) => {
        Promise.resolve(theFuction(req,res,next)).catch(next);
    };
};