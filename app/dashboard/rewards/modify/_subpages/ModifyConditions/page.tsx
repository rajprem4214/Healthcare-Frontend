import rewardApi from '@/app/api/reward';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/datatable/table';
import { Comparator, RewardCondition } from '@/models/reward';
import { getRewardModifyStore } from '@/store/reward/modify';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { rewardDetailsValidator } from '../ModifyBaseReward/validators';
import { addConditionValidator } from './validators';

export interface ModifyConditionProps {
  formManager: UseFormReturn<
    z.infer<typeof rewardDetailsValidator>,
    any,
    undefined
  >;
}

export default function ModifyConditions(props: ModifyConditionProps) {
  const modifyRewardStore = getRewardModifyStore();
  //   const { toast } = useToast();

  const conditionForm = useForm<z.infer<typeof addConditionValidator>>({
    resolver: zodResolver(addConditionValidator),
    defaultValues: {
      comparator: Comparator.isEqual,
      field: '',
      value: '',
    },
  });

  const conditionFieldManager = useFieldArray({
    control: props.formManager.control,
    name: 'conditions',
  });

  const onConditionAdd = (value: z.infer<typeof addConditionValidator>) => {
    conditionFieldManager.append(value);
  };

  const deleteCondition = async (arrIdx: number) => {
    if (modifyRewardStore.type === 'UPDATE') {
      const condition = conditionFieldManager.fields[
        arrIdx
      ] as unknown as RewardCondition;

      if (condition) {
        try {
          await rewardApi.deleteRewardCondition(condition);
        } catch (error) {
          //   const tUnsunb = toast({
          //     title: 'Deletion Failed',
          //     description: 'Failed to delete the condition',
          //     variant: 'destructive',
          //   });
          //   setTimeout(() => {
          //     tUnsunb.dismiss();
          //   }, 700);

          return;
        }
      }
    }
    conditionFieldManager.remove(arrIdx);
  };

  return (
    <section className="w-full flex flex-col gap-5">
      <div className="">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Modify Conditions</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...conditionForm}>
              <form
                className=" grid gap-5"
                onSubmit={conditionForm.handleSubmit(onConditionAdd)}
              >
                <div className="grid grid-cols-[2fr_1fr_2fr] gap-5">
                  <div>
                    <FormField
                      control={conditionForm.control}
                      name="field"
                      render={({ field }) => {
                        return (
                          <>
                            <FormLabel>Field Name</FormLabel>
                            <FormControl>
                              <Input {...field}></Input>
                            </FormControl>
                            <FormMessage className="text-center"></FormMessage>
                          </>
                        );
                      }}
                    ></FormField>
                  </div>
                  <div>
                    <FormField
                      control={conditionForm.control}
                      name="comparator"
                      render={({ field }) => {
                        return (
                          <>
                            <FormLabel>Comparator</FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full capitalize">
                                  <SelectValue
                                    className="capitalize"
                                    placeholder=""
                                  ></SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="">
                                <SelectGroup>
                                  {Object.values(Comparator).map((status) => (
                                    <SelectItem
                                      key={status}
                                      value={status}
                                      className="capitalize"
                                    >
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            <FormMessage className="text-center"></FormMessage>
                          </>
                        );
                      }}
                    ></FormField>
                  </div>
                  <div>
                    <FormField
                      control={conditionForm.control}
                      name="value"
                      render={({ field }) => {
                        return (
                          <>
                            <FormLabel>Field Value</FormLabel>
                            <FormControl>
                              <Input {...field}></Input>
                            </FormControl>
                            <FormMessage className="text-center"></FormMessage>
                          </>
                        );
                      }}
                    ></FormField>
                  </div>
                </div>

                <div className="flex flex-row-reverse  mt-5">
                  <Button className="w-fit" type="submit">
                    Add
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-[1350px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Existing Conditions</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Sr No.</TableHead>
                  <TableHead className="text-center">Field Name</TableHead>
                  <TableHead className="text-center">Comparator</TableHead>
                  <TableHead className="text-center">Value</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conditionFieldManager.fields.map((c, idx) => (
                  <TableRow
                    key={`${c.field}-${c.comparator}-${c.value}-${idx}`}
                  >
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell className="text-center">{c.field}</TableCell>
                    <TableCell className="text-center">
                      {c.comparator}
                    </TableCell>
                    <TableCell className="text-center">{c.value}</TableCell>

                    <TableCell className="text-center">
                      <Button
                        onClick={() => {
                          deleteCondition(idx);
                        }}
                        className="bg-red-500 hover:bg-red-400"
                      >
                        <Trash2 className="w-5 h-5 stroke-white  cursor-pointer  rounded-md"></Trash2>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
