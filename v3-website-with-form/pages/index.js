
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Vice Versa (V3)</h1>
        <p className="text-xl mt-2 italic">Fuel the journey. Fund the mission.</p>
      </header>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">About V3</h2>
            <p>
              Vice Versa (V3) is a social impact brand combining survival nutrition, blockchain gaming,
              and real-world change. Through our V3 Super Pemmican Bars and the V3 Game, we empower
              people to give, grow, and game for good.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p>
              To spotlight homelessness, break societal barriers, and bring dignity and nourishment to
              communities through decentralized tech and practical action. True freedom is the pursuit
              of happiness — and nobody gets left behind.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Current Projects</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>V3 Super Bars:</strong> Nutrient-dense, shelf-stable food supporting the homeless and health-conscious buyers alike.</li>
              <li><strong>V3 Game:</strong> A location-based survival metaverse where real-life donations unlock rewards, resources, and impact.</li>
              <li><strong>MOBX Token:</strong> Power the mission, earn by helping others, and stake to build a new kind of economy.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
        <p className="mb-4">
          Support the mission. Buy a bar. Sponsor a shelter. Or just send a message. Together, we flip the script.
        </p>
        <Button>Contact Josh</Button>
      </section>
    </div>
  );
}

