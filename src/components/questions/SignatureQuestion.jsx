"use client";

import { useState, useRef } from "react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// components
import SignaturePad from "react-signature-canvas";

// utilities
import { cn } from "@/lib/utils";
import { compressBase64Image } from "@/utilities";

const SignatureQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;

  // hooks
  const signature_canvas_ref = useRef({});

  const [is_open, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={is_open} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            {...field}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full",
              !field.value && "text-muted-foreground",
              form.formState.errors[question.id] && "border-destructive"
            )}
          >
            Click here to sign
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign here</DialogTitle>
          </DialogHeader>

          <div className="border">
            <SignaturePad
              ref={signature_canvas_ref}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: "sigCanvas",
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                signature_canvas_ref.current.clear();
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (signature_canvas_ref.current.toData().length > 0) {
                  const base_64_image = signature_canvas_ref.current
                    .getTrimmedCanvas()
                    .toDataURL("image/png");

                  const compressed_base_64_image = await compressBase64Image(
                    base_64_image
                  );

                  field.onChange(compressed_base_64_image);
                } else {
                  field.onChange("");
                }

                setIsOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {field.value && (
        <img className="border rounded p-2 mt-2" src={field.value} />
      )}
    </div>
  );
};

export default SignatureQuestion;
