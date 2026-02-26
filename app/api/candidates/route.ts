// app/api/candidates/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { candidateSchema } from '../../../lib/validations';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = candidateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({
        error: { code: "VALIDATION_ERROR", message: "Invalid data", details: parsed.error.flatten().fieldErrors }
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_candidates')
      .insert([parsed.data])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: { code: "CONFLICT", message: "Candidate already saved." } }, { status: 409 });
      }
      throw error; 
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Save Candidate POST Error:", error);
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to save." } }, { status: 500 });
  }
}

export async function GET() {
  try {
    // FIX 1: Added .select('*') before calling .order()
    const { data, error } = await supabase
      .from('saved_candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Fetch Candidates GET Error:", error);
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to fetch candidates." } }, { status: 500 });
  }
}

const updateNoteSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  // FIX 2: Replaced .allow('') with Zod's .optional()
  notes: z.string().max(500, "Notes too long").optional(),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: { code: "VALIDATION_ERROR", message: "Invalid note data", details: parsed.error.flatten().fieldErrors }
      }, { status: 400 });
    }

    const { id, notes } = parsed.data;

    const { data, error } = await supabase
      .from('saved_candidates')
      .update({ notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update Note PATCH Error:", error);
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to update notes." } }, { status: 500 });
  }
}