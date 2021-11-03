import { Heading } from 'grommet';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AnchorLink } from './AnchorLink';
import { useAPI } from '../hooks/useQuery';
import { Box, Button, DateInput, Form, FormExtendedEvent, FormField, TextArea, TextInput } from 'grommet';
import { localDateFormat } from '../utils/localDateFormat';

export type ApplicationFormState = {
  company: string,
  position: string,
  description: string,
  link: string,
  date?: string,
};

const dateFormat = localDateFormat();

export const ApplicationNew = () => {
  const history = useHistory();
  const [value, setValue] = useState<ApplicationFormState>({ company: '', link: '', position: '', description: '', date: undefined });
  const goToHome = useCallback(() => {
    history.push('/');
  }, [history]);
  const [createApplication, { isLoading }] = useAPI('/applications', { method: 'POST', onCompleted: goToHome })
  const handleSubmit = (data: FormExtendedEvent<ApplicationFormState, Element>) => {
    createApplication(data.value);
  }
  return (
    <>
      <AnchorLink to="/" label="< Home" />
      <Heading level="2">New Application</Heading>
      <Form
        value={ value }
        onChange={ (nextValue: ApplicationFormState) => setValue(nextValue) }
        onSubmit={ handleSubmit }
      >
        <FormField label="Company" name="company" htmlFor="company" required>
          <TextInput
            id="company"
            name="company"
            type="text"
            placeholder="Company Name"
          />
        </FormField>
        <FormField label="Position" name="position" htmlFor="position" required>
          <TextInput
            id="position"
            name="position"
            type="text"
            placeholder="Rockstar developer"
          />
        </FormField>
        <Box width="medium">
          <FormField label="Application date" name="createdAt" htmlFor="createdAt" required>
            <DateInput
              id="createdAt"
              name="createdAt"
              format={ dateFormat }
            />
          </FormField>
        </Box>
        <FormField label="Job Link" name="link" htmlFor="link">
          <TextInput
            id="link"
            name="link"
            type="text"
            placeholder="Link of the Job Listing"
          />
        </FormField>
        <FormField label="Job Description" name="description" htmlFor="description">
          <TextArea
            id="description"
            name="description"
            placeholder="Add the job description for future reference"
          />
        </FormField>
        <Button type="submit" label="Create" primary disabled={ isLoading } />
      </Form>
    </>
  )
}
