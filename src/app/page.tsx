const ITEMS = [
  "We are a Ukrainian service center operating in Germany and specializing in the repair of smartphones, laptops, tablets, PCs, consoles and other electronics",
  "Professional equipment, many years of experience and an individual approach - a guarantee of quality repairs at a reasonable price",
  "We work quickly and with care for the client",
];

export default function HomePage() {
  return (
    <main className="text-justify text-lg sm:text-2xl">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
        <span style={{ color: "blue" }}>Qafy</span>{" "}
        <span style={{ color: "yellow" }}>Mobile</span>
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-20 text-center">
        Your reliable electronics repair service in Germany
      </h2>
      <div className="flex flex-col gap-12 md:gap-18 md:text-2xl">
        {ITEMS.map((item) => (
          <section key={item}>
            <p>{item}</p>
            <hr className="border-muted-foreground border-2" />
          </section>
        ))}
      </div>
    </main>
  );
}
