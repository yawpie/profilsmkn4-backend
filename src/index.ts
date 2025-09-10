import app from "./app";

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
