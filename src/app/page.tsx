const ITEMS = [
  "We are a Ukrainian service center operating in Germany and specializing in the repair of smartphones, laptops, tablets, PCs, consoles and other electronics",
  "Professional equipment, many years of experience and an individual approach - a guarantee of quality repairs at a reasonable price",
  "We work quickly and with care for the client",
];

export default function HomePage() {
  return (
    <main className="text-justify text-lg sm:text-2xl">
      <header>
        <h1 className="pageHeading">
          <span style={{ color: "blue" }}>Qafy</span>{" "}
          <span style={{ color: "yellow" }}>Mobile</span>
        </h1>
        <h2 className="pageSubHeading">
          Your reliable electronics repair service in Germany
        </h2>
      </header>
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
