import { Box, Form, FormField, Select } from 'grommet';
import { useEffect, useState } from 'react';
import { useAPI } from '../../../hooks/useQuery';
import { ApplicationStatus } from '../../../models';

// the prefix name of the Create option entry
const prefix = 'Create';
const newStatusId = '0';

type Option = ApplicationStatus & {
  text?: string;
}

type Props = {
  status: ApplicationStatus;
  onChangeStatus: (newStatus: ApplicationStatus) => void;
}

type FormState = {
  status: Option,
};

export const ApplicationStatuSelector = (props: Props) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [ getStatuses, { data: statuses, error, isLoading }] = useAPI<ApplicationStatus[]>('/statuses');

  useEffect(() => {
    if (statuses) {
      setOptions(statuses);
    }
  }, [statuses]);

  useEffect(() => {
    getStatuses();
  }, [props.status.id, getStatuses])

  const searchOrCreateStatus = (text: string) => {
    const len = options.length;
    let newOptions = [...options];
    if (options[len - 1].content.includes(prefix)) {
      newOptions.pop();
    }
    newOptions.push({
      content: `${prefix} '${text}'`,
      text,
      id: newStatusId,
    });
    setOptions(newOptions.filter((option) => option.content.indexOf(text) > -1));
  }

  const changeStatus = async ({ status: newStatusData }: FormState) => {
    if (newStatusData.id === newStatusId) {
      props.onChangeStatus({
        id: newStatusId,
        content: newStatusData.text!,
      });
    } else {
      props.onChangeStatus(newStatusData);
    }
  }

  if (error) {
    return <div>Error</div>;
  }

  if (isLoading || !statuses) {
    return <div>Loading...</div>;
  }

  return (
    <Box width="medium">
      <Form
        value={ {
          status: props.status,
        } }
        onChange={ changeStatus }
      >
        <FormField name="status">
          <Select
            name="status"
            options={ options }
            labelKey="content"
            valueKey="id"
            onSearch={ searchOrCreateStatus }
          />
        </FormField>
      </Form>
    </Box>
  );
};
