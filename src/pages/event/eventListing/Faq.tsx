import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

type FaqProps = {
  items: FaqItem[]
}

type FaqItem = {
  faqId: number
  question: string
  answer: string
}

const Faq: React.FC<FaqProps> = ({ items }) => {
  const FaqItems: CollapseProps['items'] = []

  for (let i = 0; i < items.length; i++) {
    FaqItems.push({
      key: i,
      label: items[i].question,
      children: items[i].answer
    })
  }

  return <Collapse items={FaqItems} />;
};

export default Faq;
