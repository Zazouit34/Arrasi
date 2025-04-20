"use client"

import { useRouter, useSearchParams } from "next/navigation"
//import { Calendar } from "@/components/ui/calendar"
//import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
//import { CalendarIcon } from "lucide-react"
import { useState } from "react"
//import { format } from "date-fns"
import { algeriaCities } from "@/app/config/cities"

export function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //const [date, setDate] = useState<Date>()
  
  // Local state for filters
  const [filters, setFilters] = useState({
    city: searchParams.get('city') ?? '',
    guests: searchParams.get('guests') ?? '',
    budget: searchParams.get('budget') ?? ''
  })

  const handleFilterChange = (value: string, paramName: 'city' | 'guests' | 'budget') => {
    setFilters(prev => ({
      ...prev,
      [paramName]: value
    }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Only add parameters that have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="container mx-auto px-4 -mt-16 relative z-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Location Select */}
          <Select 
            onValueChange={(value) => handleFilterChange(value, 'city')}
            value={filters.city}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {algeriaCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Guests Select */}
          <Select
            onValueChange={(value) => handleFilterChange(value, 'guests')}
            value={filters.guests}
          >
            <SelectTrigger>
              <SelectValue placeholder="Guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">Up to 50</SelectItem>
              <SelectItem value="100">50-100</SelectItem>
              <SelectItem value="200">100-200</SelectItem>
              <SelectItem value="300">200-300</SelectItem>
              <SelectItem value="400">300+</SelectItem>
            </SelectContent>
          </Select>

          {/* Budget Select */}
          <Select
            onValueChange={(value) => handleFilterChange(value, 'budget')}
            value={filters.budget}
          >
            <SelectTrigger>
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000000">Under 1,000,000 DZD</SelectItem>
              <SelectItem value="2000000">1,000,000 - 2,000,000 DZD</SelectItem>
              <SelectItem value="3000000">2,000,000 - 3,000,000 DZD</SelectItem>
              <SelectItem value="3000001">3,000,000+ DZD</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker */}
          {/*<Popover>
            <PopoverTrigger className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <span className="text-muted-foreground">
                {date ? format(date, "PPP") : "Pick a date"}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>*/}
        </div>
        
        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={handleSearch}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Search Venues
          </button>
        </div>
      </div>
    </section>
  )
}