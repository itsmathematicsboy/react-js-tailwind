import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const AppModal = ({
  show,
  onClose,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  showFooter = true,
  children,
  title,
}) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, illum
            nostrum! Distinctio vel voluptatem dolorem molestias quam inventore
            eum doloremque itaque tenetur ipsum similique asperiores, ea, minima
            officiis! Ratione, voluptates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="py-2">{children}</div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading" : submitLabel}
            </Button>
            <Button variant="outline" onClick={() => onClose(false)}>
              {cancelLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
