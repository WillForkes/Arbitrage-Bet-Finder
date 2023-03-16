import ProfileLoader from "@/components/ProfileLoader";
import { User, Invoice } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import { getter } from "@/api";
import { Card, TextInput, Label, Checkbox, Button, Textarea} from "flowbite-react";

export default function support() {

    return (
    <>
        <div className="page-offset-x py-8 bg-gray-900">

            <Card className="py-8 px-4 mx-auto max-w-screen-md sm:py-16 lg:px-6 md:px-12">
                <form className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="email1"
                            value="Your email"
                        />
                        </div>
                        <TextInput
                        id="email1"
                        type="email"
                        placeholder="name@arbster.com"
                        required={true}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="title"
                            value="Title"
                        />
                        </div>
                        <TextInput
                        id="title"
                        type="text"
                        required={true}
                        />
                    </div>
                    <div id="textarea">
                        <div className="mb-2 block">
                            <Label
                            htmlFor="comment"
                            value="Your message"
                            />
                        </div>
                        <Textarea
                            id="comment"
                            placeholder="Leave a comment..."
                            required={true}
                            rows={4}
                        />
                    </div>
                    <Button type="submit">
                        Submit
                    </Button>
                    </form>
            </Card>
        </div>
    </>
    );
}
