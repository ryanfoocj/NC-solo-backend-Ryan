const { PORT = 9090 } = process.env;

const app = express();

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
