"use client";

import * as React from "react";
import { Plus, MapPin, Edit2, Trash2, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types";

export function AddressesContent() {
  const addToast = useUIStore((s) => s.addToast);
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.addresses.list(),
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [form, setForm] = React.useState({
    label: "",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const openAddDialog = () => {
    setEditingAddress(null);
    setForm({ label: "", name: "", phone: "", street: "", city: "", state: "", zip: "", country: "United States" });
    setDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    addToast({
      title: editingAddress ? "Address updated" : "Address added",
      variant: "success",
    });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    addToast({ title: "Address removed", variant: "default" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : addresses?.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
          title="No addresses saved"
          description="Add a shipping address for faster checkout"
          action={{ label: "Add Address", onClick: openAddDialog }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses?.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{address.label}</span>
                    {address.isDefault && (
                      <Badge variant="success" className="text-xs">
                        <Check className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(address)}
                      aria-label="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(address.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <p className="font-medium">{address.name}</p>
                  <p className="text-muted-foreground">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Home, Office..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Street Address</Label>
              <Input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAddress ? "Update" : "Save"} Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
