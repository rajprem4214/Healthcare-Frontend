import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createSectionValidator } from "../validators"

export interface QuestionnaireSectionCreatorProps {
    onCreate: (data: QuestionnaireSection) => void
}

export default function QuestionnaireSectionCreator(props: QuestionnaireSectionCreatorProps) {
    const formHook = useForm<z.infer<typeof createSectionValidator>>({
        resolver: zodResolver(createSectionValidator),
        defaultValues: {
            name: "",
        },
    })

    const onFormSubmit = (data: z.infer<typeof createSectionValidator>) => {
        const section: QuestionnaireSection = {
            ...data,
            items: [],
        }

        try {
            props.onCreate(section)
        } catch (error) {
            // Show toast over here
        }
    }
    return (
        <Card className="border-none">
            <CardHeader>
                <h1 className="text-primary text-xl">Add Section</h1>
                <hr className="  my-2 border-t" />
            </CardHeader>
            <CardContent>
                <Form {...formHook}>
                    <form
                        onSubmit={formHook.handleSubmit(onFormSubmit)}
                        className="flex flex-col gap-5">
                        <div>
                            <FormField
                                control={formHook.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="The name of the section"
                                                    {...field}></Input>
                                            </FormControl>
                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div className="col-span-full flex justify-end">
                            <Button
                                className="w-fit flex items-center justify-evenly"
                                type="submit">
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
