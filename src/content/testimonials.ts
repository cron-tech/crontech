export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// Empty by default - no real testimonial has been collected yet. The
// DifferentiatorsSection block that renders these must not appear when
// this array is empty (LP-03 AC5/AC6) - never fill it with placeholder text.
export const testimonials: Testimonial[] = [];
