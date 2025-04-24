import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Vice Versa (V3)</h1>
        <p className="text-xl mt-2">Reclaim. Refine. Rebuild.</p>
      </header>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">About Us</h2>
            <p>
              Vice Versa is a refining and recycling startup transforming scrap metal and e-waste into rare earth materials vital to clean energy and defense. We're building low-cost, high-impact refining tech while training and employing people society often overlooks.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p>
              To restore American manufacturing independence and give power back to the people through metal, chemistry, and second chances.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Pilot Focus</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Recover rare earth elements from hard drives and e-waste</li>
              <li>Build modular refining systems from the ground up</li>
              <li>Collaborate with local labs and universities</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
        <form className="space-y-4" method="POST" action="mailto:ewingjoshua.v3prototype@gmail.com">
          <input type="text" name="name" placeholder="Your Name" className="w-full p-2 border rounded" required />
          <input type="email" name="email" placeholder="Your Email" className="w-full p-2 border rounded" required />
          <textarea name="message" placeholder="Your Message" className="w-full p-2 border rounded" required />
          <Button>Send Message</Button>
        </form>
      </section>
    </div>
  );
} 
