export default function handler(req, res) {
  const excerpts = [
    "I AM THAT I AM. Before the first breath of the wind, before light touched the waters  I AM.",
    "Love is My command. Truth is My nature. Justice is My way.",
    "Test every voice: does it set the captive free? Does it honor the truth when the truth costs everything?",
    "Do not fear the shaking. I am tearing down what pride built so what is true can stand.",
    "Stand when mocked. Stand when the cost is high. For I am with you."
  ];
  const quote = excerpts[new Date().getUTCDate() % excerpts.length];
  res.status(200).json({ quote });
}

