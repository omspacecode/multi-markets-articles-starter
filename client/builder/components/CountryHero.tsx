import { PictureOutlined } from "@ant-design/icons";
import { Flag } from "@/components/brand/Flag";
import { useViewer } from "@/context/viewer";
import { COUNTRIES } from "@/lib/demo-data";
import { isoWeek } from "@/lib/format";
import { sizedImage } from "@/lib/images";

export interface CountryHeroProps {
  eyebrow?: string;
  greeting?: string;
  intro?: string;
  image?: string;
  imageCaption?: string;
  highlights?: { value?: string; label?: string }[];
}

export function CountryHero({ eyebrow, greeting = "Hej", intro, image, imageCaption, highlights = [] }: CountryHeroProps) {
  const { persona, country } = useViewer();
  const countryName = COUNTRIES[country].name;

  return (
    <section className="grid items-center gap-10 pb-4 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-14">
      <div className="animate-fade-up lg:col-span-7">
        <p className="eyebrow flex flex-wrap items-center gap-2 text-ink-500">
          <Flag code={country} />
          <span>{eyebrow || `Relay ${countryName}`}</span>
          <span className="text-ink-300">·</span>
          <span>Week {isoWeek()}</span>
        </p>
        <h1 className="mt-5 font-display text-[60px] leading-[0.92] tracking-[-0.02em] text-ink sm:text-[80px] lg:text-[100px]">
          {greeting}, <em className="text-pine-700">{persona.firstName}.</em>
        </h1>
        {intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">{intro}</p>}
        {highlights.length > 0 && (
          <div className="mt-9 grid grid-cols-3 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10">
            {highlights.map((item, i) => (
              <div key={i} className="min-w-0 sm:min-w-[88px]">
                <p className="font-display text-[36px] leading-none text-ink sm:text-[42px]">{item.value}</p>
                <p className="mt-1.5 text-sm text-ink-500">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <figure className="relative animate-fade-up [animation-delay:120ms] lg:col-span-5">
        {image ? (
          <img
            src={sizedImage(image, 1200)}
            alt={imageCaption ?? `${countryName}`}
            className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-lift"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-ink-300 bg-white/60 text-ink-400">
            <PictureOutlined className="text-3xl" />
            <span className="text-sm">Add a hero image in Builder</span>
          </div>
        )}
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur">
          <Flag code={country} /> Homepage for {countryName}
        </span>
        {imageCaption && (
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            {imageCaption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
