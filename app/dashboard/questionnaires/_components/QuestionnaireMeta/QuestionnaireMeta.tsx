import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QuestionnaireStatus, QuestionnaireSubject } from "@/models/QuestionnaireEnum"
import { UseFormReturn } from "react-hook-form"

export interface QuestionnaireMetaProps {
    formHook: UseFormReturn<Partial<Questionnaire>>
    isUsedUpdate?: boolean
    onSubmit: (data: Partial<Questionnaire>) => void
}

export default function QuestionnaireMetaForm(props: QuestionnaireMetaProps) {
    return (
        <Card className="shadow-sm border rounded-lg bg-white  w-full">
            <CardHeader>
                <h1 className="text-primary text-xl"> Questionnaire Details</h1>
                <hr className="  my-2 border-t" />
            </CardHeader>
            <CardContent>
                <Form {...props.formHook}>
                    <form
                        onSubmit={props.formHook.handleSubmit(props.onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <FormField
                                control={props.formHook.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name to identify form"
                                                    {...field}></Input>
                                            </FormControl>
                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <FormField
                                control={props.formHook.control}
                                name="title"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="This will be visible to patients."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-center" />
                                        </>
                                    )
                                }}></FormField>
                        </div>

                        <div>
                            <FormField
                                control={props.formHook.control}
                                name="status"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Select status"></SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.values(QuestionnaireStatus).map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                                className="capitalize">
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}></FormField>
                        </div>
                        <div>
                            <FormField
                                control={props.formHook.control}
                                name="subject"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Subject</FormLabel>

                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder=""></SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.values(QuestionnaireSubject).map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                                className="capitalize">
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}></FormField>
                        </div>
                        <div className="col-span-full">
                            <FormField
                                control={props.formHook.control}
                                name="description"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explanation or brief about the questionnaire."
                                                    {...field}></Textarea>
                                            </FormControl>
                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}></FormField>
                        </div>

                        <div className="col-span-full flex justify-end">
                            <Button
                                className="w-fit"
                                type="submit">
                                {props.isUsedUpdate ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
