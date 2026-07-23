type FaqItem = { question: string; answer: string };

export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}<span aria-hidden="true">+</span></summary>
          <div><p>{item.answer}</p></div>
        </details>
      ))}
    </div>
  );
}
