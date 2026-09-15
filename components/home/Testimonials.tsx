import { Reveal } from "@/components/ui/Reveal";
import { StarRating } from "@/components/ui/StarRating";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Reveal key={testimonial.name} delay={index * 0.08}>
          <figure className="card-shadow h-full rounded-2xl border border-mint-2 bg-white p-5">
            <StarRating value={testimonial.rating} />
            <blockquote className="mt-2 text-sm leading-relaxed opacity-85">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold">
              {testimonial.name}
              <span className="font-normal opacity-60"> · {testimonial.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
