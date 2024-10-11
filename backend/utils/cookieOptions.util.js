
const cookieOptions = () => {
  //secure: process.env.NODE_ENV === "production",
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
}

export default cookieOptions