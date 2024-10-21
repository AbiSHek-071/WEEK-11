import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
const FilterSidebar = ({ className }) => (
  <div className={className}>
    <h2 className='text-xl font-semibold mb-4'>Filters</h2>
    <Accordion type='single' collapsible className='w-full'>
      {["Category", "Fit", "Sleeve", "Size"].map((filter) => (
        <AccordionItem key={filter} value={filter.toLowerCase()}>
          <AccordionTrigger className='text-sm font-medium'>
            {filter}
          </AccordionTrigger>
          <AccordionContent>
            <div className='space-y-2'>
              {["Option 1", "Option 2", "Option 3"].map((option) => (
                <div key={option} className='flex items-center space-x-2'>
                  <Checkbox id={`${filter}-${option}`} />
                  <label
                    htmlFor={`${filter}-${option}`}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
export default FilterSidebar;