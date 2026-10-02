import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button, EForgeProvider, Input} from '@eforge/ui';
import {EmptyDataState, EForgeQueryProvider} from '@eforge/data';
import {FormPage} from '@eforge/patterns';
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/patterns/styles.css';

function Playground() {
  const [value, setValue] = useState('');
  return (
    <FormPage
      eyebrow="Integration sandbox"
      title="EForge Playground"
      description="A minimal surface for validating public package APIs.">
      <Input label="Project name" value={value} onChange={setValue} placeholder="Acme Portal" />
      <Button label="Primary action" variant="primary" />
      <EmptyDataState title="No domain data" description="Business components remain outside the foundation until proven reusable." />
    </FormPage>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EForgeProvider>
      <EForgeQueryProvider>
        <main style={{padding: 32}}><Playground /></main>
      </EForgeQueryProvider>
    </EForgeProvider>
  </StrictMode>,
);
